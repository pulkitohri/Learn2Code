package com.luv2code.springbootlibrary.service;

import com.luv2code.springbootlibrary.dao.BookRepository;
import com.luv2code.springbootlibrary.dao.CheckoutRepository;
import com.luv2code.springbootlibrary.dao.ReviewRepository;
import com.luv2code.springbootlibrary.entity.Book;
import com.luv2code.springbootlibrary.requestmodels.AddBookRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class AdminService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CheckoutRepository checkoutRepository;

    @Autowired
    private ReviewRepository reviewRepository;


    public void changeQuantity(Long bookId, int updatedQuantity) throws Exception{
        Optional<Book> book  = bookRepository.findById(bookId);
        if(book.isEmpty()){
            throw new Exception("Book not found!");
        }
        int net = updatedQuantity - book.get().getCopies();
        book.get().setCopies(book.get().getCopies()+net);
        book.get().setCopiesAvailable(book.get().getCopiesAvailable()+net);

        bookRepository.save(book.get());
    }
    public void postBook(AddBookRequest addBookRequest){
        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImg(addBookRequest.getImg());

        bookRepository.save(book);
    }

    public void deleteBook(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);
        if(book.isEmpty()){
            throw new Exception("Book does not exist");
        }
        checkoutRepository.deleteByBookId(bookId);
        reviewRepository.deleteByBookId(bookId);
        bookRepository.delete(book.get());


    }

}
