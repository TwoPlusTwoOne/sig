package com.mycompany.myapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.ProductInPurchaseOrder;
import com.mycompany.myapp.repository.ProductInPurchaseOrderRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import com.mycompany.myapp.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing ProductInPurchaseOrder.
 */
@RestController
@RequestMapping("/api")
public class ProductInPurchaseOrderResource {

    private final Logger log = LoggerFactory.getLogger(ProductInPurchaseOrderResource.class);

    private static final String ENTITY_NAME = "productInPurchaseOrder";

    private final ProductInPurchaseOrderRepository productInPurchaseOrderRepository;

    public ProductInPurchaseOrderResource(ProductInPurchaseOrderRepository productInPurchaseOrderRepository) {
        this.productInPurchaseOrderRepository = productInPurchaseOrderRepository;
    }

    /**
     * POST  /product-in-purchase-orders : Create a new productInPurchaseOrder.
     *
     * @param productInPurchaseOrder the productInPurchaseOrder to create
     * @return the ResponseEntity with status 201 (Created) and with body the new productInPurchaseOrder, or with status 400 (Bad Request) if the productInPurchaseOrder has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/product-in-purchase-orders")
    @Timed
    public ResponseEntity<ProductInPurchaseOrder> createProductInPurchaseOrder(@RequestBody ProductInPurchaseOrder productInPurchaseOrder) throws URISyntaxException {
        log.debug("REST request to save ProductInPurchaseOrder : {}", productInPurchaseOrder);
        if (productInPurchaseOrder.getId() != null) {
            throw new BadRequestAlertException("A new productInPurchaseOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductInPurchaseOrder result = productInPurchaseOrderRepository.save(productInPurchaseOrder);
        return ResponseEntity.created(new URI("/api/product-in-purchase-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /product-in-purchase-orders : Updates an existing productInPurchaseOrder.
     *
     * @param productInPurchaseOrder the productInPurchaseOrder to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated productInPurchaseOrder,
     * or with status 400 (Bad Request) if the productInPurchaseOrder is not valid,
     * or with status 500 (Internal Server Error) if the productInPurchaseOrder couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/product-in-purchase-orders")
    @Timed
    public ResponseEntity<ProductInPurchaseOrder> updateProductInPurchaseOrder(@RequestBody ProductInPurchaseOrder productInPurchaseOrder) throws URISyntaxException {
        log.debug("REST request to update ProductInPurchaseOrder : {}", productInPurchaseOrder);
        if (productInPurchaseOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ProductInPurchaseOrder result = productInPurchaseOrderRepository.save(productInPurchaseOrder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, productInPurchaseOrder.getId().toString()))
            .body(result);
    }

    /**
     * GET  /product-in-purchase-orders : get all the productInPurchaseOrders.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of productInPurchaseOrders in body
     */
    @GetMapping("/product-in-purchase-orders")
    @Timed
    public List<ProductInPurchaseOrder> getAllProductInPurchaseOrders() {
        log.debug("REST request to get all ProductInPurchaseOrders");
        return productInPurchaseOrderRepository.findAll();
    }

    /**
     * GET  /product-in-purchase-orders/:id : get the "id" productInPurchaseOrder.
     *
     * @param id the id of the productInPurchaseOrder to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the productInPurchaseOrder, or with status 404 (Not Found)
     */
    @GetMapping("/product-in-purchase-orders/{id}")
    @Timed
    public ResponseEntity<ProductInPurchaseOrder> getProductInPurchaseOrder(@PathVariable Long id) {
        log.debug("REST request to get ProductInPurchaseOrder : {}", id);
        Optional<ProductInPurchaseOrder> productInPurchaseOrder = productInPurchaseOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productInPurchaseOrder);
    }

    /**
     * DELETE  /product-in-purchase-orders/:id : delete the "id" productInPurchaseOrder.
     *
     * @param id the id of the productInPurchaseOrder to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/product-in-purchase-orders/{id}")
    @Timed
    public ResponseEntity<Void> deleteProductInPurchaseOrder(@PathVariable Long id) {
        log.debug("REST request to delete ProductInPurchaseOrder : {}", id);

        productInPurchaseOrderRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
