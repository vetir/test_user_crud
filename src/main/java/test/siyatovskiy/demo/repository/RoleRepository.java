package test.siyatovskiy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import test.siyatovskiy.demo.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

}
