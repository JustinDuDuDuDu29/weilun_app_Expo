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

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid dates
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  