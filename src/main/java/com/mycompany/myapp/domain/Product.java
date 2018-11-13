package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "stock")
    private Double stock;

    @Column(name = "units_per_box")
    private Integer unitsPerBox;

    @Column(name = "boxes_per_pallet")
    private Integer boxesPerPallet;

    @OneToMany(mappedBy = "product")
    private Set<ProductInPurchaseOrder> purchaseOrders = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Product name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getWeight() {
        return weight;
    }

    public Product weight(Double weight) {
        this.weight = weight;
        return this;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getStock() {
        return stock;
    }

    public Product stock(Double stock) {
        this.stock = stock;
        return this;
    }

    public void setStock(Double stock) {
        this.stock = stock;
    }

    public Integer getUnitsPerBox() {
        return unitsPerBox;
    }

    public Product unitsPerBox(Integer unitsPerBox) {
        this.unitsPerBox = unitsPerBox;
        return this;
    }

    public void setUnitsPerBox(Integer unitsPerBox) {
        this.unitsPerBox = unitsPerBox;
    }

    public Integer getBoxesPerPallet() {
        return boxesPerPallet;
    }

    public Product boxesPerPallet(Integer boxesPerPallet) {
        this.boxesPerPallet = boxesPerPallet;
        return this;
    }

    public void setBoxesPerPallet(Integer boxesPerPallet) {
        this.boxesPerPallet = boxesPerPallet;
    }

    public Set<ProductInPurchaseOrder> getPurchaseOrders() {
        return purchaseOrders;
    }

    public Product purchaseOrders(Set<ProductInPurchaseOrder> productInPurchaseOrders) {
        this.purchaseOrders = productInPurchaseOrders;
        return this;
    }

    public Product addPurchaseOrder(ProductInPurchaseOrder productInPurchaseOrder) {
        this.purchaseOrders.add(productInPurchaseOrder);
        productInPurchaseOrder.setProduct(this);
        return this;
    }

    public Product removePurchaseOrder(ProductInPurchaseOrder productInPurchaseOrder) {
        this.purchaseOrders.remove(productInPurchaseOrder);
        productInPurchaseOrder.setProduct(null);
        return this;
    }

    public void setPurchaseOrders(Set<ProductInPurchaseOrder> productInPurchaseOrders) {
        this.purchaseOrders = productInPurchaseOrders;
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
        Product product = (Product) o;
        if (product.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), product.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", weight=" + getWeight() +
            ", stock=" + getStock() +
            ", unitsPerBox=" + getUnitsPerBox() +
            ", boxesPerPallet=" + getBoxesPerPallet() +
            "}";
    }
}
