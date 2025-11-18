

export function normalizeFormValue<T>(value: T, keyForTrim: string): string {
    if (keyForTrim && value && typeof value === 'object' && keyForTrim in value) {
        const clonedValue = { ...value } as T;
        const key = keyForTrim as keyof T;
        if (typeof clonedValue[key] === 'string') {
            clonedValue[key] = (clonedValue[key] as unknown as string).trim() as unknown as T[keyof T];
        }
        return JSON.stringify(clonedValue);
    }

    return JSON.stringify(value);
}
