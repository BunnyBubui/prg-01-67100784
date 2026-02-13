package com.example.orders.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.orders.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {    
}
