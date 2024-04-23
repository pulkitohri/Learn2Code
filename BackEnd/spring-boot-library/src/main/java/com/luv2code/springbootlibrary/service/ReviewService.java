package com.luv2code.springbootlibrary.service;


import com.luv2code.springbootlibrary.dao.BookRepository;
import com.luv2code.springbootlibrary.dao.ReviewRepository;
import com.luv2code.springbootlibrary.entity.Review;
import com.luv2code.springbootlibrary.requestmodels.ReviewRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;

@Service
@Transactional
public class ReviewService {

    @Autowired
    private BookRepository bookRepository ;

    @Autowired
    private ReviewRepository reviewRepository ;

    public void postReview(String userEmail , ReviewRequest reviewRequest) throws Exception{
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail,reviewRequest.getBookId());

        if(validateReview !=null)
            throw new Exception("Review already Created");

        Review review = new Review();

        review.setBookId(reviewRequest.getBookId());
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);
        review.setDate(Date.valueOf(LocalDate.now()));

        if(reviewRequest.getReviewDescription().isPresent()){
            review.setReviewDescription(reviewRequest.getReviewDescription()
                    .map(Object :: toString).orElse(null));
        }

        reviewRepository.save(review);

    }

    public boolean userListedReview(String userEmail , Long bookId){
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail,bookId);

        return validateReview != null;
    }
}
