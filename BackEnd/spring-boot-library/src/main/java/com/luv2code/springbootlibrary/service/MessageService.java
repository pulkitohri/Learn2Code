package com.luv2code.springbootlibrary.service;


import com.luv2code.springbootlibrary.dao.MessageRepository;
import com.luv2code.springbootlibrary.entity.Message;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public void postMessage(Message messageRequest , String userEmail){
        Message message = new Message();
        message.setTitle(messageRequest.getTitle());
        message.setQuestion(messageRequest.getQuestion());
        message.setUserEmail(userEmail);
        System.out.println(message);

        messageRepository.save(message);
    }
}
