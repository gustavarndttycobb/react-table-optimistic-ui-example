import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import type { Item } from '../models/item.model';
import { mockedApi } from '../services/mockedApi';
import { idGen } from '../utils/idGenerator';


export default function OptimisticTable() {
    const [items, setItems] = useState<Item[]>([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState<{ message: string; open: boolean }>({
        message: '',
        open: false,
    });

    useEffect(() => {
        mockedApi.getItems().then((data) => {
            setItems(data);
            setLoading(false);
        });
    }, []);

    const showMessage = (message: string) => {
        setSnackbar({ message, open: true });
    };

    const handleAdd = () => {
        const tempId = idGen.next().value as string;
        const tempItem: Item = { id: tempId, name: newName, status: 'saving' };
        setItems((prev) => [...prev, tempItem]);
        setNewName('');

        mockedApi
            .createItem({ name: tempItem.name })
            .then((res) => {
                setItems((prev) =>
                    prev.map((item) =>
                        item.id === tempId
                            ? { id: res.id, name: item.name, status: 'saved' }
                            : item
                    )
                );
                showMessage('Item saved successfully');
            })
            .catch(() => {
                setItems((prev) =>
                    prev.map((item) =>
                        item.id === tempId ? { ...item, status: 'error' } : item
                    )
                );
                showMessage('Failed to save item');
            });
    };

    const handleDelete = (id: string) => {
        const item = items.find((i) => i.id === id);
        setItems((prev) => prev.filter((item) => item.id !== id));
        if (item?.status === 'saved') {
            mockedApi.deleteItem(id).catch(() => showMessage('Failed to delete item'));
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Container>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: "2rem"
            }}>
                <Typography>Optimistic UI with Temporary ID</Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: "1rem"
                }}>
                    <TextField
                        label="New item"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        size='small'
                    />
                    <Button variant="contained" size='medium' onClick={handleAdd} disabled={!newName}>
                        Add
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                key={item.id}
                                sx={{
                                    backgroundColor: item.status === 'error' ? '#ffebee' : undefined,
                                }}
                            >
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={3000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            />
        </Container>
    );
}
