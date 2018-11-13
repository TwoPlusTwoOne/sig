package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Truck;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Truck entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TruckRepository extends JpaRepository<Truck, Long> {

}
