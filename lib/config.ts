const config = {
    obscureStr: (value: string | number, number?: number): string => {
        const str = value.toString()
        const x = str.slice(0, number || 5)
        const y = str.slice(-(number || 5))
        return `${x}****${y}`
    }
}
export default config