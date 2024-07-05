
function mergeInto<T extends string, U>(destObj: Record<T, U>): (obj: Record<T, U>) => Record<T, U> {
    function merging(obj: Record<T, U>): Record<T, U> {
        return { ...destObj, ...obj }
    }
    return merging;
}

function updateInto<T extends string, U>(destObj: Record<T, U>, props: Array<T>): (obj: Record<T, U>) => void {
    function update(obj: Record<T, U>): void {
        for (let p of props) {
            if (obj[p]) {
                if (destObj[p]) {
                    destObj[p] = obj[p];
                }
                else {
                    Object.defineProperty(destObj, p, obj[p]);
                }
            }
        }
    }
    return update;
}

export {mergeInto, updateInto}