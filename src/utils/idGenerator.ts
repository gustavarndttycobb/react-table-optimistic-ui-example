function* tempIdGenerator(prefix = 'temp') {
    let count = 1;
    while (true) {
        yield `${prefix}-${count++}`;
    }
}

export const idGen = tempIdGenerator();
