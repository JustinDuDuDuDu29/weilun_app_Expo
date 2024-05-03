let yourDate = new Date()
yourDate.toISOString().split('T')[0]


export default class giveMeDate {
    constructor() {
        
    }
    /**
     * now_yyyymmdd
     * return date with format yyymmdd
     */
    public now_yyyymmdd() {
       return new Date().toISOString().split('T')[0] 
    }
}