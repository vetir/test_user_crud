package test.siyatovskiy.demo.service;

import test.siyatovskiy.demo.model.Role;

import java.util.List;

public interface RoleService {
    List<Role> getAllRoles();
    Role getById(long id);
}
