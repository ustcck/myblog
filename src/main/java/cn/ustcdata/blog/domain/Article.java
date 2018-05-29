package cn.ustcdata.blog.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Article.
 */
@Entity
@Table(name = "article")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "article")
public class Article implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "title", length = 50, nullable = false)
    private String title;

    @Size(max = 150)
    @Column(name = "summary", length = 150)
    private String summary;

    @Lob
    @Column(name = "content")
    private String content;

    @Column(name = "click")
    private Integer click;

    @Column(name = "jhi_create")
    private LocalDate create;

    @Column(name = "jhi_update")
    private LocalDate update;

    @ManyToOne
    @JsonIgnoreProperties("")
    private User user;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "article_category",
               joinColumns = @JoinColumn(name = "articles_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "categories_id", referencedColumnName = "id"))
    private Set<Category> categories = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Article title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public Article summary(String summary) {
        this.summary = summary;
        return this;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getContent() {
        return content;
    }

    public Article content(String content) {
        this.content = content;
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getClick() {
        return click;
    }

    public Article click(Integer click) {
        this.click = click;
        return this;
    }

    public void setClick(Integer click) {
        this.click = click;
    }

    public LocalDate getCreate() {
        return create;
    }

    public Article create(LocalDate create) {
        this.create = create;
        return this;
    }

    public void setCreate(LocalDate create) {
        this.create = create;
    }

    public LocalDate getUpdate() {
        return update;
    }

    public Article update(LocalDate update) {
        this.update = update;
        return this;
    }

    public void setUpdate(LocalDate update) {
        this.update = update;
    }

    public User getUser() {
        return user;
    }

    public Article user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public Article categories(Set<Category> categories) {
        this.categories = categories;
        return this;
    }

    public Article addCategory(Category category) {
        this.categories.add(category);
        category.getArticles().add(this);
        return this;
    }

    public Article removeCategory(Category category) {
        this.categories.remove(category);
        category.getArticles().remove(this);
        return this;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Article article = (Article) o;
        if (article.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), article.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Article{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", summary='" + getSummary() + "'" +
            ", content='" + getContent() + "'" +
            ", click=" + getClick() +
            ", create='" + getCreate() + "'" +
            ", update='" + getUpdate() + "'" +
            "}";
    }
}
