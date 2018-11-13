package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.SigApp;

import com.mycompany.myapp.domain.ProductInPurchaseOrder;
import com.mycompany.myapp.repository.ProductInPurchaseOrderRepository;
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
 * Test class for the ProductInPurchaseOrderResource REST controller.
 *
 * @see ProductInPurchaseOrderResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SigApp.class)
public class ProductInPurchaseOrderResourceIntTest {

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    @Autowired
    private ProductInPurchaseOrderRepository productInPurchaseOrderRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restProductInPurchaseOrderMockMvc;

    private ProductInPurchaseOrder productInPurchaseOrder;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProductInPurchaseOrderResource productInPurchaseOrderResource = new ProductInPurchaseOrderResource(productInPurchaseOrderRepository);
        this.restProductInPurchaseOrderMockMvc = MockMvcBuilders.standaloneSetup(productInPurchaseOrderResource)
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
    public static ProductInPurchaseOrder createEntity(EntityManager em) {
        ProductInPurchaseOrder productInPurchaseOrder = new ProductInPurchaseOrder()
            .quantity(DEFAULT_QUANTITY);
        return productInPurchaseOrder;
    }

    @Before
    public void initTest() {
        productInPurchaseOrder = createEntity(em);
    }

    @Test
    @Transactional
    public void createProductInPurchaseOrder() throws Exception {
        int databaseSizeBeforeCreate = productInPurchaseOrderRepository.findAll().size();

        // Create the ProductInPurchaseOrder
        restProductInPurchaseOrderMockMvc.perform(post("/api/product-in-purchase-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productInPurchaseOrder)))
            .andExpect(status().isCreated());

        // Validate the ProductInPurchaseOrder in the database
        List<ProductInPurchaseOrder> productInPurchaseOrderList = productInPurchaseOrderRepository.findAll();
        assertThat(productInPurchaseOrderList).hasSize(databaseSizeBeforeCreate + 1);
        ProductInPurchaseOrder testProductInPurchaseOrder = productInPurchaseOrderList.get(productInPurchaseOrderList.size() - 1);
        assertThat(testProductInPurchaseOrder.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
    }

    @Test
    @Transactional
    public void createProductInPurchaseOrderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = productInPurchaseOrderRepository.findAll().size();

        // Create the ProductInPurchaseOrder with an existing ID
        productInPurchaseOrder.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductInPurchaseOrderMockMvc.perform(post("/api/product-in-purchase-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productInPurchaseOrder)))
            .andExpect(status().isBadRequest());

        // Validate the ProductInPurchaseOrder in the database
        List<ProductInPurchaseOrder> productInPurchaseOrderList = productInPurchaseOrderRepository.findAll();
        assertThat(productInPurchaseOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllProductInPurchaseOrders() throws Exception {
        // Initialize the database
        productInPurchaseOrderRepository.saveAndFlush(productInPurchaseOrder);

        // Get all the productInPurchaseOrderList
        restProductInPurchaseOrderMockMvc.perform(get("/api/product-in-purchase-orders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productInPurchaseOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)));
    }
    
    @Test
    @Transactional
    public void getProductInPurchaseOrder() throws Exception {
        // Initialize the database
        productInPurchaseOrderRepository.saveAndFlush(productInPurchaseOrder);

        // Get the productInPurchaseOrder
        restProductInPurchaseOrderMockMvc.perform(get("/api/product-in-purchase-orders/{id}", productInPurchaseOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(productInPurchaseOrder.getId().intValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY));
    }

    @Test
    @Transactional
    public void getNonExistingProductInPurchaseOrder() throws Exception {
        // Get the productInPurchaseOrder
        restProductInPurchaseOrderMockMvc.perform(get("/api/product-in-purchase-orders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProductInPurchaseOrder() throws Exception {
        // Initialize the database
        productInPurchaseOrderRepository.saveAndFlush(productInPurchaseOrder);

        int databaseSizeBeforeUpdate = productInPurchaseOrderRepository.findAll().size();

        // Update the productInPurchaseOrder
        ProductInPurchaseOrder updatedProductInPurchaseOrder = productInPurchaseOrderRepository.findById(productInPurchaseOrder.getId()).get();
        // Disconnect from session so that the updates on updatedProductInPurchaseOrder are not directly saved in db
        em.detach(updatedProductInPurchaseOrder);
        updatedProductInPurchaseOrder
            .quantity(UPDATED_QUANTITY);

        restProductInPurchaseOrderMockMvc.perform(put("/api/product-in-purchase-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProductInPurchaseOrder)))
            .andExpect(status().isOk());

        // Validate the ProductInPurchaseOrder in the database
        List<ProductInPurchaseOrder> productInPurchaseOrderList = productInPurchaseOrderRepository.findAll();
        assertThat(productInPurchaseOrderList).hasSize(databaseSizeBeforeUpdate);
        ProductInPurchaseOrder testProductInPurchaseOrder = productInPurchaseOrderList.get(productInPurchaseOrderList.size() - 1);
        assertThat(testProductInPurchaseOrder.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    public void updateNonExistingProductInPurchaseOrder() throws Exception {
        int databaseSizeBeforeUpdate = productInPurchaseOrderRepository.findAll().size();

        // Create the ProductInPurchaseOrder

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductInPurchaseOrderMockMvc.perform(put("/api/product-in-purchase-orders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(productInPurchaseOrder)))
            .andExpect(status().isBadRequest());

        // Validate the ProductInPurchaseOrder in the database
        List<ProductInPurchaseOrder> productInPurchaseOrderList = productInPurchaseOrderRepository.findAll();
        assertThat(productInPurchaseOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteProductInPurchaseOrder() throws Exception {
        // Initialize the database
        productInPurchaseOrderRepository.saveAndFlush(productInPurchaseOrder);

        int databaseSizeBeforeDelete = productInPurchaseOrderRepository.findAll().size();

        // Get the productInPurchaseOrder
        restProductInPurchaseOrderMockMvc.perform(delete("/api/product-in-purchase-orders/{id}", productInPurchaseOrder.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ProductInPurchaseOrder> productInPurchaseOrderList = productInPurchaseOrderRepository.findAll();
        assertThat(productInPurchaseOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductInPurchaseOrder.class);
        ProductInPurchaseOrder productInPurchaseOrder1 = new ProductInPurchaseOrder();
        productInPurchaseOrder1.setId(1L);
        ProductInPurchaseOrder productInPurchaseOrder2 = new ProductInPurchaseOrder();
        productInPurchaseOrder2.setId(productInPurchaseOrder1.getId());
        assertThat(productInPurchaseOrder1).isEqualTo(productInPurchaseOrder2);
        productInPurchaseOrder2.setId(2L);
        assertThat(productInPurchaseOrder1).isNotEqualTo(productInPurchaseOrder2);
        productInPurchaseOrder1.setId(null);
        assertThat(productInPurchaseOrder1).isNotEqualTo(productInPurchaseOrder2);
    }
}
