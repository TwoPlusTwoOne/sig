package com.mycompany.myapp.domain;


import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Truck.
 */
@Entity
@Table(name = "truck")
public class Truck implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "max_pallets")
    private Integer maxPallets;

    @Column(name = "max_weight")
    private Double maxWeight;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMaxPallets() {
        return maxPallets;
    }

    public Truck maxPallets(Integer maxPallets) {
        this.maxPallets = maxPallets;
        return this;
    }

    public void setMaxPallets(Integer maxPallets) {
        this.maxPallets = maxPallets;
    }

    public Double getMaxWeight() {
        return maxWeight;
    }

    public Truck maxWeight(Double maxWeight) {
        this.maxWeight = maxWeight;
        return this;
    }

    public void setMaxWeight(Double maxWeight) {
        this.maxWeight = maxWeight;
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
        Truck truck = (Truck) o;
        if (truck.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), truck.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Truck{" +
            "id=" + getId() +
            ", maxPallets=" + getMaxPallets() +
            ", maxWeight=" + getMaxWeight() +
            "}";
    }
}
