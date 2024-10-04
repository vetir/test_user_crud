package test.siyatovskiy.demo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import test.siyatovskiy.demo.service.UserService;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ViewController {

    private final UserService userService;

    @RequestMapping("/admin/adminPanel")
    public String adminPanel(Model model, Principal principal) {
        model.addAttribute("loggedInUser",userService.findByUsername(principal.getName()));
        return "adminPage";
    }

    @RequestMapping("/user")
    public String userPage(Model model, Principal principal) {
        model.addAttribute("user", userService.findByUsername(principal.getName()));
        return "userPage";
    }
}
