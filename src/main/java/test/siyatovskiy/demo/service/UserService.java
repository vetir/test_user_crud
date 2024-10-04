package test.siyatovskiy.demo.service;

import test.siyatovskiy.demo.model.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getById(long id);
    void addNewUser(User user);
    void updateUser(User user, long id);
    User deleteById(long id);
    User findByUsername(String username);
    boolean checkEmailExistence(String email);
    boolean checkUsernameExistence(String username);
}
