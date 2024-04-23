class HistoryModel {
    id:number;
    userEmail:string;
    checkoutDate:string;
    returnedDate:string;
    title:string;
    description:string;
    author:string;
    img:string;

    constructor(id:number,
        userEmail:string,
        checkoutDate:string,
        returnedDate:string,
        title:string,
        description:string,
        author:string,
        img:string){
            this.id = id;
             this.userEmail = userEmail;
             this.checkoutDate = checkoutDate; 
             this.returnedDate = returnedDate;
             this.title = title; 
             this.description = description ;
             this.author = author ; 
             this.img = img ; 

        }

 
}
export default HistoryModel;