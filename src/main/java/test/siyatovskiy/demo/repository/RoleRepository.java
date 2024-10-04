package test.siyatovskiy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import test.siyatovskiy.demo.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

}
