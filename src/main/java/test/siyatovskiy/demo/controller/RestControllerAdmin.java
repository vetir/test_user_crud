package test.siyatovskiy.demo.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import test.siyatovskiy.demo.model.Role;
import test.siyatovskiy.demo.model.User;
import test.siyatovskiy.demo.service.RoleService;
import test.siyatovskiy.demo.service.UserService;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class RestControllerAdmin {

    private final UserService userService;
    private final RoleService roleService;

    @GetMapping("/users")
    public List<User> showAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/roles")
    public List<Role> getAllRoles() { return roleService.getAllRoles(); }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable("id") long id) {
        return userService.getById(id);
    }

    @PostMapping("/users")
    public ResponseEntity<?> addNewUser(@Valid @RequestBody User user, BindingResult bindingResult) {
        validateFieldsUniqueness(user, bindingResult);

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        user.setRoles(manageRoles(user.getRoles()));
        userService.addNewUser(user);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") long id,
                                        @Valid @RequestBody User user,
                                        BindingResult bindingResult) {
        validateFieldsUniqueness(user, bindingResult);

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        user.setRoles(manageRoles(user.getRoles()));
        userService.updateUser(user, id);

        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    public User deleteUser(@PathVariable("id") long id) {
        return userService.deleteById(id);
    }

    private Set<Role> manageRoles(Set<Role> roles) {
        return roles.stream()
                .map(role -> roleService.getById(role.getId()))
                .collect(Collectors.toSet());
    }

    private void validateFieldsUniqueness(User user, BindingResult bindingResult) {
        if (userService.checkEmailExistence(user.getEmail())) {
            bindingResult.rejectValue("email", "email.notUnique", "Email address already taken");
        }
        if (userService.checkUsernameExistence(user.getUsername())) {
            bindingResult.rejectValue("username", "username.notUnique", "Username already taken");
        }
    }
}
