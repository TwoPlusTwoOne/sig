package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.SigApp;

import com.mycompany.myapp.domain.Truck;
import com.mycompany.myapp.repository.TruckRepository;
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
 * Test class for the TruckResource REST controller.
 *
 * @see TruckResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SigApp.class)
public class TruckResourceIntTest {

    private static final Integer DEFAULT_MAX_PALLETS = 1;
    private static final Integer UPDATED_MAX_PALLETS = 2;

    private static final Double DEFAULT_MAX_WEIGHT = 1D;
    private static final Double UPDATED_MAX_WEIGHT = 2D;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTruckMockMvc;

    private Truck truck;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TruckResource truckResource = new TruckResource(truckRepository);
        this.restTruckMockMvc = MockMvcBuilders.standaloneSetup(truckResource)
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
    public static Truck createEntity(EntityManager em) {
        Truck truck = new Truck()
            .maxPallets(DEFAULT_MAX_PALLETS)
            .maxWeight(DEFAULT_MAX_WEIGHT);
        return truck;
    }

    @Before
    public void initTest() {
        truck = createEntity(em);
    }

    @Test
    @Transactional
    public void createTruck() throws Exception {
        int databaseSizeBeforeCreate = truckRepository.findAll().size();

        // Create the Truck
        restTruckMockMvc.perform(post("/api/trucks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(truck)))
            .andExpect(status().isCreated());

        // Validate the Truck in the database
        List<Truck> truckList = truckRepository.findAll();
        assertThat(truckList).hasSize(databaseSizeBeforeCreate + 1);
        Truck testTruck = truckList.get(truckList.size() - 1);
        assertThat(testTruck.getMaxPallets()).isEqualTo(DEFAULT_MAX_PALLETS);
        assertThat(testTruck.getMaxWeight()).isEqualTo(DEFAULT_MAX_WEIGHT);
    }

    @Test
    @Transactional
    public void createTruckWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = truckRepository.findAll().size();

        // Create the Truck with an existing ID
        truck.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTruckMockMvc.perform(post("/api/trucks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(truck)))
            .andExpect(status().isBadRequest());

        // Validate the Truck in the database
        List<Truck> truckList = truckRepository.findAll();
        assertThat(truckList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllTrucks() throws Exception {
        // Initialize the database
        truckRepository.saveAndFlush(truck);

        // Get all the truckList
        restTruckMockMvc.perform(get("/api/trucks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(truck.getId().intValue())))
            .andExpect(jsonPath("$.[*].maxPallets").value(hasItem(DEFAULT_MAX_PALLETS)))
            .andExpect(jsonPath("$.[*].maxWeight").value(hasItem(DEFAULT_MAX_WEIGHT.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getTruck() throws Exception {
        // Initialize the database
        truckRepository.saveAndFlush(truck);

        // Get the truck
        restTruckMockMvc.perform(get("/api/trucks/{id}", truck.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(truck.getId().intValue()))
            .andExpect(jsonPath("$.maxPallets").value(DEFAULT_MAX_PALLETS))
            .andExpect(jsonPath("$.maxWeight").value(DEFAULT_MAX_WEIGHT.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingTruck() throws Exception {
        // Get the truck
        restTruckMockMvc.perform(get("/api/trucks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTruck() throws Exception {
        // Initialize the database
        truckRepository.saveAndFlush(truck);

        int databaseSizeBeforeUpdate = truckRepository.findAll().size();

        // Update the truck
        Truck updatedTruck = truckRepository.findById(truck.getId()).get();
        // Disconnect from session so that the updates on updatedTruck are not directly saved in db
        em.detach(updatedTruck);
        updatedTruck
            .maxPallets(UPDATED_MAX_PALLETS)
            .maxWeight(UPDATED_MAX_WEIGHT);

        restTruckMockMvc.perform(put("/api/trucks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTruck)))
            .andExpect(status().isOk());

        // Validate the Truck in the database
        List<Truck> truckList = truckRepository.findAll();
        assertThat(truckList).hasSize(databaseSizeBeforeUpdate);
        Truck testTruck = truckList.get(truckList.size() - 1);
        assertThat(testTruck.getMaxPallets()).isEqualTo(UPDATED_MAX_PALLETS);
        assertThat(testTruck.getMaxWeight()).isEqualTo(UPDATED_MAX_WEIGHT);
    }

    @Test
    @Transactional
    public void updateNonExistingTruck() throws Exception {
        int databaseSizeBeforeUpdate = truckRepository.findAll().size();

        // Create the Truck

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTruckMockMvc.perform(put("/api/trucks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(truck)))
            .andExpect(status().isBadRequest());

        // Validate the Truck in the database
        List<Truck> truckList = truckRepository.findAll();
        assertThat(truckList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTruck() throws Exception {
        // Initialize the database
        truckRepository.saveAndFlush(truck);

        int databaseSizeBeforeDelete = truckRepository.findAll().size();

        // Get the truck
        restTruckMockMvc.perform(delete("/api/trucks/{id}", truck.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Truck> truckList = truckRepository.findAll();
        assertThat(truckList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Truck.class);
        Truck truck1 = new Truck();
        truck1.setId(1L);
        Truck truck2 = new Truck();
        truck2.setId(truck1.getId());
        assertThat(truck1).isEqualTo(truck2);
        truck2.setId(2L);
        assertThat(truck1).isNotEqualTo(truck2);
        truck1.setId(null);
        assertThat(truck1).isNotEqualTo(truck2);
    }
}
