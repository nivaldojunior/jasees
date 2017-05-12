export class Election {
    constructor(
        public id?: string,
        public name?: string,
        public desc?: string,
        public candList?: any[],
        public initDate?: any,
        public endDate?: any,
    ) {
    }
}
