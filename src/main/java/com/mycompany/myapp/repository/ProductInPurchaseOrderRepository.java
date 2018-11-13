package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ProductInPurchaseOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ProductInPurchaseOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductInPurchaseOrderRepository extends JpaRepository<ProductInPurchaseOrder, Long> {

}
