package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.SigApp;

import com.mycompany.myapp.domain.Locale;
import com.mycompany.myapp.repository.LocaleRepository;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;


import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the LocaleResource REST controller.
 *
 * @see LocaleResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SigApp.class)
public class LocaleResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_REGION = "AAAAAAAAAA";
    private static final String UPDATED_REGION = "BBBBBBBBBB";

    private static final String DEFAULT_PROVINCE = "AAAAAAAAAA";
    private static final String UPDATED_PROVINCE = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    @Autowired
    private LocaleRepository localeRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLocaleMockMvc;

    private Locale locale;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LocaleResource localeResource = new LocaleResource(localeRepository);
        this.restLocaleMockMvc = MockMvcBuilders.standaloneSetup(localeResource)
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
    public static Locale createEntity(EntityManager em) {
        Locale locale = new Locale()
            .name(DEFAULT_NAME)
            .address(DEFAULT_ADDRESS)
            .region(DEFAULT_REGION)
            .province(DEFAULT_PROVINCE)
            .city(DEFAULT_CITY);
        return locale;
    }

    @Before
    public void initTest() {
        locale = createEntity(em);
    }

    @Test
    @Transactional
    public void createLocale() throws Exception {
        int databaseSizeBeforeCreate = localeRepository.findAll().size();

        // Create the Locale
        restLocaleMockMvc.perform(post("/api/locales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(locale)))
            .andExpect(status().isCreated());

        // Validate the Locale in the database
        List<Locale> localeList = localeRepository.findAll();
        assertThat(localeList).hasSize(databaseSizeBeforeCreate + 1);
        Locale testLocale = localeList.get(localeList.size() - 1);
        assertThat(testLocale.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLocale.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testLocale.getRegion()).isEqualTo(DEFAULT_REGION);
        assertThat(testLocale.getProvince()).isEqualTo(DEFAULT_PROVINCE);
        assertThat(testLocale.getCity()).isEqualTo(DEFAULT_CITY);
    }

    @Test
    @Transactional
    public void createLocaleWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = localeRepository.findAll().size();

        // Create the Locale with an existing ID
        locale.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLocaleMockMvc.perform(post("/api/locales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(locale)))
            .andExpect(status().isBadRequest());

        // Validate the Locale in the database
        List<Locale> localeList = localeRepository.findAll();
        assertThat(localeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllLocales() throws Exception {
        // Initialize the database
        localeRepository.saveAndFlush(locale);

        // Get all the localeList
        restLocaleMockMvc.perform(get("/api/locales?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(locale.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS.toString())))
            .andExpect(jsonPath("$.[*].region").value(hasItem(DEFAULT_REGION.toString())))
            .andExpect(jsonPath("$.[*].province").value(hasItem(DEFAULT_PROVINCE.toString())))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY.toString())));
    }
    
    @Test
    @Transactional
    public void getLocale() throws Exception {
        // Initialize the database
        localeRepository.saveAndFlush(locale);

        // Get the locale
        restLocaleMockMvc.perform(get("/api/locales/{id}", locale.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(locale.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS.toString()))
            .andExpect(jsonPath("$.region").value(DEFAULT_REGION.toString()))
            .andExpect(jsonPath("$.province").value(DEFAULT_PROVINCE.toString()))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLocale() throws Exception {
        // Get the locale
        restLocaleMockMvc.perform(get("/api/locales/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLocale() throws Exception {
        // Initialize the database
        localeRepository.saveAndFlush(locale);

        int databaseSizeBeforeUpdate = localeRepository.findAll().size();

        // Update the locale
        Locale updatedLocale = localeRepository.findById(locale.getId()).get();
        // Disconnect from session so that the updates on updatedLocale are not directly saved in db
        em.detach(updatedLocale);
        updatedLocale
            .name(UPDATED_NAME)
            .address(UPDATED_ADDRESS)
            .region(UPDATED_REGION)
            .province(UPDATED_PROVINCE)
            .city(UPDATED_CITY);

        restLocaleMockMvc.perform(put("/api/locales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLocale)))
            .andExpect(status().isOk());

        // Validate the Locale in the database
        List<Locale> localeList = localeRepository.findAll();
        assertThat(localeList).hasSize(databaseSizeBeforeUpdate);
        Locale testLocale = localeList.get(localeList.size() - 1);
        assertThat(testLocale.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLocale.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testLocale.getRegion()).isEqualTo(UPDATED_REGION);
        assertThat(testLocale.getProvince()).isEqualTo(UPDATED_PROVINCE);
        assertThat(testLocale.getCity()).isEqualTo(UPDATED_CITY);
    }

    @Test
    @Transactional
    public void updateNonExistingLocale() throws Exception {
        int databaseSizeBeforeUpdate = localeRepository.findAll().size();

        // Create the Locale

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLocaleMockMvc.perform(put("/api/locales")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(locale)))
            .andExpect(status().isBadRequest());

        // Validate the Locale in the database
        List<Locale> localeList = localeRepository.findAll();
        assertThat(localeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteLocale() throws Exception {
        // Initialize the database
        localeRepository.saveAndFlush(locale);

        int databaseSizeBeforeDelete = localeRepository.findAll().size();

        // Get the locale
        restLocaleMockMvc.perform(delete("/api/locales/{id}", locale.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Locale> localeList = localeRepository.findAll();
        assertThat(localeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Locale.class);
        Locale locale1 = new Locale();
        locale1.setId(1L);
        Locale locale2 = new Locale();
        locale2.setId(locale1.getId());
        assertThat(locale1).isEqualTo(locale2);
        locale2.setId(2L);
        assertThat(locale1).isNotEqualTo(locale2);
        locale1.setId(null);
        assertThat(locale1).isNotEqualTo(locale2);
    }
}
