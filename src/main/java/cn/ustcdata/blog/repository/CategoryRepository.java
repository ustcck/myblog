package cn.ustcdata.blog.repository;

import cn.ustcdata.blog.domain.Category;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("select category from Category category where category.user.login = ?#{principal.username}")
    List<Category> findByUserIsCurrentUser();

}
