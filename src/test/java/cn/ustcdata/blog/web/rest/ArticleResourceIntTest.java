package cn.ustcdata.blog.web.rest;

import cn.ustcdata.blog.PersonalBlogApp;

import cn.ustcdata.blog.domain.Article;
import cn.ustcdata.blog.repository.ArticleRepository;
import cn.ustcdata.blog.repository.search.ArticleSearchRepository;
import cn.ustcdata.blog.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;

import static cn.ustcdata.blog.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ArticleResource REST controller.
 *
 * @see ArticleResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PersonalBlogApp.class)
public class ArticleResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_SUMMARY = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Integer DEFAULT_CLICK = 1;
    private static final Integer UPDATED_CLICK = 2;

    private static final LocalDate DEFAULT_CREATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_UPDATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private ArticleRepository articleRepository;
    @Mock
    private ArticleRepository articleRepositoryMock;

    /**
     * This repository is mocked in the cn.ustcdata.blog.repository.search test package.
     *
     * @see cn.ustcdata.blog.repository.search.ArticleSearchRepositoryMockConfiguration
     */
    @Autowired
    private ArticleSearchRepository mockArticleSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restArticleMockMvc;

    private Article article;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ArticleResource articleResource = new ArticleResource(articleRepository, mockArticleSearchRepository);
        this.restArticleMockMvc = MockMvcBuilders.standaloneSetup(articleResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Article createEntity(EntityManager em) {
        Article article = new Article()
            .title(DEFAULT_TITLE)
            .summary(DEFAULT_SUMMARY)
            .content(DEFAULT_CONTENT)
            .click(DEFAULT_CLICK)
            .create(DEFAULT_CREATE)
            .update(DEFAULT_UPDATE);
        return article;
    }

    @Before
    public void initTest() {
        article = createEntity(em);
    }

    @Test
    @Transactional
    public void createArticle() throws Exception {
        int databaseSizeBeforeCreate = articleRepository.findAll().size();

        // Create the Article
        restArticleMockMvc.perform(post("/api/articles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(article)))
            .andExpect(status().isCreated());

        // Validate the Article in the database
        List<Article> articleList = articleRepository.findAll();
        assertThat(articleList).hasSize(databaseSizeBeforeCreate + 1);
        Article testArticle = articleList.get(articleList.size() - 1);
        assertThat(testArticle.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testArticle.getSummary()).isEqualTo(DEFAULT_SUMMARY);
        assertThat(testArticle.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testArticle.getClick()).isEqualTo(DEFAULT_CLICK);
        assertThat(testArticle.getCreate()).isEqualTo(DEFAULT_CREATE);
        assertThat(testArticle.getUpdate()).isEqualTo(DEFAULT_UPDATE);

        // Validate the Article in Elasticsearch
        verify(mockArticleSearchRepository, times(1)).save(testArticle);
    }

    @Test
    @Transactional
    public void createArticleWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = articleRepository.findAll().size();

        // Create the Article with an existing ID
        article.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restArticleMockMvc.perform(post("/api/articles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(article)))
            .andExpect(status().isBadRequest());

        // Validate the Article in the database
        List<Article> articleList = articleRepository.findAll();
        assertThat(articleList).hasSize(databaseSizeBeforeCreate);

        // Validate the Article in Elasticsearch
        verify(mockArticleSearchRepository, times(0)).save(article);
    }

    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = articleRepository.findAll().size();
        // set the field null
        article.setTitle(null);

        // Create the Article, which fails.

        restArticleMockMvc.perform(post("/api/articles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(article)))
            .andExpect(status().isBadRequest());

        List<Article> articleList = articleRepository.findAll();
        assertThat(articleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllArticles() throws Exception {
        // Initialize the database
        articleRepository.saveAndFlush(article);

        // Get all the articleList
        restArticleMockMvc.perform(get("/api/articles?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(article.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY.toString())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].click").value(hasItem(DEFAULT_CLICK)))
            .andExpect(jsonPath("$.[*].create").value(hasItem(DEFAULT_CREATE.toString())))
            .andExpect(jsonPath("$.[*].update").value(hasItem(DEFAULT_UPDATE.toString())));
    }
    
    public void getAllArticlesWithEagerRelationshipsIsEnabled() throws Exception {
        ArticleResource articleResource = new ArticleResource(articleRepositoryMock, mockArticleSearchRepository);
        when(articleRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restArticleMockMvc = MockMvcBuilders.standaloneSetup(articleResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restArticleMockMvc.perform(get("/api/articles?eagerload=true"))
        .andExpect(status().isOk());

        verify(articleRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    public void getAllArticlesWithEagerRelationshipsIsNotEnabled() throws Exception {
        ArticleResource articleResource = new ArticleResource(articleRepositoryMock, mockArticleSearchRepository);
            when(articleRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restArticleMockMvc = MockMvcBuilders.standaloneSetup(articleResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restArticleMockMvc.perform(get("/api/articles?eagerload=true"))
        .andExpect(status().isOk());

            verify(articleRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getArticle() throws Exception {
        // Initialize the database
        articleRepository.saveAndFlush(article);

        // Get the article
        restArticleMockMvc.perform(get("/api/articles/{id}", article.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(article.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.summary").value(DEFAULT_SUMMARY.toString()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()))
            .andExpect(jsonPath("$.click").value(DEFAULT_CLICK))
            .andExpect(jsonPath("$.create").value(DEFAULT_CREATE.toString()))
            .andExpect(jsonPath("$.update").value(DEFAULT_UPDATE.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingArticle() throws Exception {
        // Get the article
        restArticleMockMvc.perform(get("/api/articles/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateArticle() throws Exception {
        // Initialize the database
        articleRepository.saveAndFlush(article);

        int databaseSizeBeforeUpdate = articleRepository.findAll().size();

        // Update the article
        Article updatedArticle = articleRepository.findById(article.getId()).get();
        // Disconnect from session so that the updates on updatedArticle are not directly saved in db
        em.detach(updatedArticle);
        updatedArticle
            .title(UPDATED_TITLE)
            .summary(UPDATED_SUMMARY)
            .content(UPDATED_CONTENT)
            .click(UPDATED_CLICK)
            .create(UPDATED_CREATE)
            .update(UPDATED_UPDATE);

        restArticleMockMvc.perform(put("/api/articles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedArticle)))
            .andExpect(status().isOk());

        // Validate the Article in the database
        List<Article> articleList = articleRepository.findAll();
        assertThat(articleList).hasSize(databaseSizeBeforeUpdate);
        Article testArticle = articleList.get(articleList.size() - 1);
        assertThat(testArticle.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testArticle.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testArticle.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testArticle.getClick()).isEqualTo(UPDATED_CLICK);
        assertThat(testArticle.getCreate()).isEqualTo(UPDATED_CREATE);
        assertThat(testArticle.getUpdate()).isEqualTo(UPDATED_UPDATE);

        // Validate the Article in Elasticsearch
        verify(mockArticleSearchRepository, times(1)).save(testArticle);
    }

    @Test
    @Transactional
    public void updateNonExistingArticle() throws Exception {
        int databaseSizeBeforeUpdate = articleRepository.findAll().size();

        // Create the Article

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restArticleMockMvc.perform(put("/api/articles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(article)))
            .andExpect(status().isBadRequest());

        // Validate the Article in the database
        List<Article> articleList = articleRepository.findAll();
        assertThat(articleList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Article in Elasticsearch
        verify(mockArticleSearchRepository, times(0)).save(article);
    }

    @Test
    @Transactional
    public void deleteArticle() throws Exception {
        // Initialize the database
        articleRepository.saveAndFlush(article);

        int databaseSizeBeforeDelete = articleRepository.findAll().size();

        // Get the article
        restArticleMockMvc.perform(delete("/api/articles/{id}", article.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Article> articleList = articleRepository.findAll();
        assertThat(articleList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Article in Elasticsearch
        verify(mockArticleSearchRepository, times(1)).deleteById(article.getId());
    }

    @Test
    @Transactional
    public void searchArticle() throws Exception {
        // Initialize the database
        articleRepository.saveAndFlush(article);
        when(mockArticleSearchRepository.search(queryStringQuery("id:" + article.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(article), PageRequest.of(0, 1), 1));
        // Search the article
        restArticleMockMvc.perform(get("/api/_search/articles?query=id:" + article.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(article.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY.toString())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())))
            .andExpect(jsonPath("$.[*].click").value(hasItem(DEFAULT_CLICK)))
            .andExpect(jsonPath("$.[*].create").value(hasItem(DEFAULT_CREATE.toString())))
            .andExpect(jsonPath("$.[*].update").value(hasItem(DEFAULT_UPDATE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Article.class);
        Article article1 = new Article();
        article1.setId(1L);
        Article article2 = new Article();
        article2.setId(article1.getId());
        assertThat(article1).isEqualTo(article2);
        article2.setId(2L);
        assertThat(article1).isNotEqualTo(article2);
        article1.setId(null);
        assertThat(article1).isNotEqualTo(article2);
    }
}
