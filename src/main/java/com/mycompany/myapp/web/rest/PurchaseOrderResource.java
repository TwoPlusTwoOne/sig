package com.mycompany.myapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.PurchaseOrder;
import com.mycompany.myapp.repository.PurchaseOrderRepository;
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
 * REST controller for managing PurchaseOrder.
 */
@RestController
@RequestMapping("/api")
public class PurchaseOrderResource {

    private final Logger log = LoggerFactory.getLogger(PurchaseOrderResource.class);

    private static final String ENTITY_NAME = "purchaseOrder";

    private final PurchaseOrderRepository purchaseOrderRepository;

    public PurchaseOrderResource(PurchaseOrderRepository purchaseOrderRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    /**
     * POST  /purchase-orders : Create a new purchaseOrder.
     *
     * @param purchaseOrder the purchaseOrder to create
     * @return the ResponseEntity with status 201 (Created) and with body the new purchaseOrder, or with status 400 (Bad Request) if the purchaseOrder has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/purchase-orders")
    @Timed
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) throws URISyntaxException {
        log.debug("REST request to save PurchaseOrder : {}", purchaseOrder);
        if (purchaseOrder.getId() != null) {
            throw new BadRequestAlertException("A new purchaseOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PurchaseOrder result = purchaseOrderRepository.save(purchaseOrder);
        return ResponseEntity.created(new URI("/api/purchase-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /purchase-orders : Updates an existing purchaseOrder.
     *
     * @param purchaseOrder the purchaseOrder to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated purchaseOrder,
     * or with status 400 (Bad Request) if the purchaseOrder is not valid,
     * or with status 500 (Internal Server Error) if the purchaseOrder couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/purchase-orders")
    @Timed
    public ResponseEntity<PurchaseOrder> updatePurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) throws URISyntaxException {
        log.debug("REST request to update PurchaseOrder : {}", purchaseOrder);
        if (purchaseOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PurchaseOrder result = purchaseOrderRepository.save(purchaseOrder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, purchaseOrder.getId().toString()))
            .body(result);
    }

    /**
     * GET  /purchase-orders : get all the purchaseOrders.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of purchaseOrders in body
     */
    @GetMapping("/purchase-orders")
    @Timed
    public List<PurchaseOrder> getAllPurchaseOrders() {
        log.debug("REST request to get all PurchaseOrders");
        return purchaseOrderRepository.findAll();
    }

    /**
     * GET  /purchase-orders/:id : get the "id" purchaseOrder.
     *
     * @param id the id of the purchaseOrder to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the purchaseOrder, or with status 404 (Not Found)
     */
    @GetMapping("/purchase-orders/{id}")
    @Timed
    public ResponseEntity<PurchaseOrder> getPurchaseOrder(@PathVariable Long id) {
        log.debug("REST request to get PurchaseOrder : {}", id);
        Optional<PurchaseOrder> purchaseOrder = purchaseOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(purchaseOrder);
    }

    /**
     * DELETE  /purchase-orders/:id : delete the "id" purchaseOrder.
     *
     * @param id the id of the purchaseOrder to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/purchase-orders/{id}")
    @Timed
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable Long id) {
        log.debug("REST request to delete PurchaseOrder : {}", id);

        purchaseOrderRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
