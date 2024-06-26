import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { StarsReview } from "../utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage = () => {

  const {authState} = useOktaAuth();

  const [book,setBook] = useState<BookModel>();
  const [isLoading,setIsLoading] = useState(true);
  const [httpError,setHttpError] = useState(null);

  //Loans State  
  const [currentLoansCount , setCurrentLoansCount] = useState(0);
  const [loadingCurrentLoansCount , setLoadingCurrentLoansCount] = useState(true);

  //checked out state
  const [isCheckedOut , setIsCheckedOut] = useState(false); 
  const[isLoadingBookCheckedOut , setIsLoadingBookCheckedOut] = useState(false);

  //Review State
  const [reviews,setReviews] = useState<ReviewModel[]>([]);
  const [totalStars,setTotalStars] = useState(0);
  const [isLoadingReview , setIsLoadingReview] = useState(true);

  const [isReviewLeft , setIsReviewLeft] = useState(false); 
  const [isLoadingUserReview , setIsLoadingUserReview] = useState(true); 


  const bookId = (window.location.pathname).split('/')[2]
  //fetch info of a particular book id
  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const responseJson = await response.json();

      const loadedBooks: BookModel= {
        id: responseJson.id,
          title: responseJson.title,
          author: responseJson.author,
          description: responseJson.description,
          copies: responseJson.copies,
          copiesAvailable: responseJson.copiesAvailable,
          category: responseJson.category,
          img: responseJson.img,
      };

      setBook(loadedBooks);
      setIsLoading(false);
    };
    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [isCheckedOut]);

  //fetch all reviews of a book
  useEffect(() => {
    const fetchBookReviews = async () => {
      
      const reviewUrl:string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`
      
      const responseReviews = await fetch(reviewUrl);

      if(!responseReviews.ok){
        throw new Error("Something went wrong!");
      }

      const responseJsonReviews = await(responseReviews.json());

      const responseData = responseJsonReviews._embedded.reviews;
      const loadedReviews : ReviewModel[] = [];
      let weightedStarReviews : number = 0;

      for(const key in responseData){
        loadedReviews.push({
          id : responseData[key].id,
          userEmail :responseData[key].userEmail,
          date:responseData[key].date,
          rating:responseData[key].rating,
          book_id: responseData[key].bookId,
          reviewDescription: responseData[key].reviewDescription
        });
        weightedStarReviews = weightedStarReviews+ responseData[key].rating;

      }

      if(loadedReviews){
        const round = (Math.round((weightedStarReviews / loadedReviews.length)*2 ) /2).toFixed(1);
        setTotalStars(Number(round));
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false)

    };

    fetchBookReviews().catch((error:any) =>{
      setIsLoadingReview(false);
      setHttpError(error.message);
    });

  },[isReviewLeft]);

  //fetch if the review is left by user returns boolean
  useEffect(() => {
    const fetchUserReviewBook = async() => {
      if(authState && authState.isAuthenticated){
        const url = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`; 
        const requestOptions = {
          method:"GET" , 
          headers:{
            Authorization:`Bearer ${authState.accessToken?.accessToken}`,
            "Content-type":"application/json"
          }
        };
        const userReview = await fetch(url, requestOptions);
        if(!userReview.ok){
          throw new Error("Something went Wrong");
        }
        const userReviewResponseJson = await userReview.json();
        setIsReviewLeft(userReviewResponseJson);

    }
    setIsLoadingUserReview(false);
  }


    fetchUserReviewBook().catch((error :any ) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    } )



  },[authState]);


  //ffetch total number of books checked out by user
  useEffect(()=> {
    const fetchUserCurrentLoansCount = async() => {

      if(authState && authState.isAuthenticated){
        const url = "http://localhost:8080/api/books/secure/currentloans/count"; 
        const requestOptions = {
          method:"GET" , 
          headers:{
            Authorization:`Bearer ${authState.accessToken?.accessToken}`,
            "Content-type":"application/json"
          }
        };
        const currentLoansCountResponse = await fetch(url, requestOptions);
        if(!currentLoansCountResponse.ok){
          throw new Error("Something went Wrong");
        }
        const currentLoansCountResponseJson = await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansCountResponseJson);
      }
      setLoadingCurrentLoansCount(false);

    }
    fetchUserCurrentLoansCount().catch((error:any) => {
      setLoadingCurrentLoansCount(false);
      setHttpError(error.message);
      })
  },[authState,isCheckedOut]);

  // check if the book is checked out by user
  useEffect(() => {

    const fetchUserCheckedOutBook = async() =>{
      if(authState && authState.isAuthenticated){
        const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`; 
        const requestOptions = {
          method:"GET" , 
          headers:{
            Authorization:`Bearer ${authState.accessToken?.accessToken}`,
            "Content-type":"application/json"
          }
        };

        const bookCheckedOut = await fetch(url,requestOptions);

        if(!bookCheckedOut.ok){
          throw new Error("Something went Wrong!");
        }

        const bookCheckedOutJson  = await bookCheckedOut.json();
        setIsCheckedOut(bookCheckedOutJson);
      }
      setIsLoadingBookCheckedOut(false);
    }
    fetchUserCheckedOutBook().catch((error:any)=>{
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    })

  },[authState]);

  if (isLoading || isLoadingReview || loadingCurrentLoansCount || isLoadingBookCheckedOut ||isLoadingUserReview) {
    return (
      <SpinnerLoading />
    );
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function checkoutBook(){
    const url = `http://localhost:8080/api/books/secure/checkout?bookId=${bookId}`; 
        const requestOptions = {
          method:"PUT" , 
          headers:{
            Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
            "Content-type":"application/json"
          }
        };
    const checkoutResponse = await fetch(url , requestOptions); 
    if(!checkoutResponse.ok){
      throw new Error("Something Went Wrong");
    }
    setIsCheckedOut(true);
  }

  async function submitReview(starInput:number,reviewDescription:string){
    let bookId = 0 ; 
    if(book?.id){
      bookId = book?.id
    }
    const reviewRequestModel = new ReviewRequestModel(starInput , bookId , reviewDescription);
    const url = "http://localhost:8080/api/reviews/secure"
    const requestOptions = {
      method:"POST", 
      headers:{
        Authorization:`Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify(reviewRequestModel)
    };
    const returnResponse = await fetch(url , requestOptions ); 
    if(!returnResponse.ok){
      throw new Error("Something Went Wrong!");
    }
    setIsReviewLeft(true);
  }


  return (
        <div>
  <div className="container d-none d-lg-block">
    <div className="row mt-5">
        <div className="col-sm-2 col-md-2">
            {book?.img ?
            <img src={book?.img}
            width="226"
            height="349"
            alt="book" /> :
            <img src = {require("../../Images/BooksImages/book-luv2code-1000.png")}
            width="226"
            height="349"
            alt="book"/>
        }
        </div>
        
        <div className="col-4 col-md-4 container">
            <div className="ml-2">
                <h2>{book?.title}</h2>
                <h5 className="text-primary">{book?.author}</h5>
                <p className="lead">{book?.description}</p>
                <StarsReview rating={totalStars} size={32} />
            </div>
        </div>
        <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount = {currentLoansCount}
         isAuthenticated = {authState?.isAuthenticated} isCheckedOut = {isCheckedOut} checkoutBook = {checkoutBook}
         isReviewLeft = {isReviewLeft} submitReview = {submitReview}/>
    </div>
    <hr/>
    <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}  />
  </div>
  <div className="container d-lg-none mt-5">
    <div className="d-flex justify-content-center align-items-center">
    {book?.img ?
            <img src={book?.img}
            width="226"
            height="349"
            alt="book" /> :
            <img src = {require("../../Images/BooksImages/book-luv2code-1000.png")}
            width="226"
            height="349"
            alt="book"/>
        }
    </div>
    <div className="mt-4">
        <div className="ml-2">
        <h2>{book?.title}</h2>
        <h5 className="text-primary">{book?.author}</h5>
        <p className="lead">{book?.description}</p>
        <StarsReview rating={totalStars} size={32} />
        </div>

    </div>
    <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount= {currentLoansCount}
     isAuthenticated = {authState?.isAuthenticated} isCheckedOut = {isCheckedOut} checkoutBook = {checkoutBook} 
     isReviewLeft = {isReviewLeft} submitReview = {submitReview}/>
    <hr/>
    <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}  />

  </div>
  </div>
  );
};
