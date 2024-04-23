package com.luv2code.springbootlibrary.controller;


import com.luv2code.springbootlibrary.requestmodels.AddBookRequest;
import com.luv2code.springbootlibrary.service.AdminService;
import com.luv2code.springbootlibrary.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PutMapping("/secure/change/quantity/{bookId}")
    public void changeQuantity(@RequestHeader(value = "Authorization") String token,
                               @PathVariable Long bookId,
                               @RequestParam int quantity) throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token,"\"userType\"");
        if (admin== null || !admin.equals("admin")){
            throw new Exception("Admin access only");
        }

        adminService.changeQuantity(bookId,quantity);


    }

    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value="Authorization") String token,
                         @RequestBody AddBookRequest addBookRequest) throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token,"\"userType\"");
        if (admin== null || !admin.equals("admin")){
            throw new Exception("Admin access only");
        }

        adminService.postBook(addBookRequest);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestHeader(value="Authorization") String token,
            @RequestParam Long bookId) throws  Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token,"\"userType\"");
        if (admin== null || !admin.equals("admin")){
            throw new Exception("Admin access only");
        }
        adminService.deleteBook(bookId);


    }

}
