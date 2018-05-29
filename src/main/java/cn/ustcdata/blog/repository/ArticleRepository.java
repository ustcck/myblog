package cn.ustcdata.blog.repository;

import cn.ustcdata.blog.domain.Article;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Article entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    @Query("select article from Article article where article.user.login = ?#{principal.username}")
    List<Article> findByUserIsCurrentUser();

    @Query(value = "select distinct article from Article article left join fetch article.categories",
        countQuery = "select count(distinct article) from Article article")
    Page<Article> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct article from Article article left join fetch article.categories")
    List<Article> findAllWithEagerRelationships();

    @Query("select article from Article article left join fetch article.categories where article.id =:id")
    Optional<Article> findOneWithEagerRelationships(@Param("id") Long id);

}
