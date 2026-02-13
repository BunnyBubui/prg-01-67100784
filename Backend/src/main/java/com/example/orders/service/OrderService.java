package com.example.orders.service;

import org.springframework.stereotype.Service;

import com.example.orders.model.OrderItem;
import com.example.orders.model.Order;
import com.example.orders.repository.OrderRepository;

import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(Order order) {
        if (order.getItems() == null || order.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItem item : order.getItems()) {

            BigDecimal totalPrice = item.getUnitPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

            item.setTotalPrice(totalPrice);
            item.setOrder(order);

            totalAmount = totalAmount.add(totalPrice);
        }

        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
    }

    public List<Order> getOrderAll() {
        return orderRepository.findAll();
    }

    public Order updateOrder(Long id, Order updateOrder) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));

        order.setCustomerName(updateOrder.getCustomerName());
        order.setPhone(updateOrder.getPhone());
        order.setAddress(updateOrder.getAddress());

        BigDecimal totalAmount = BigDecimal.ZERO;

        order.getItems().clear();

        for (OrderItem item : updateOrder.getItems()) {

            BigDecimal totalPrice = item.getUnitPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

            item.setTotalPrice(totalPrice);
            item.setOrder(order);

            order.getItems().add(item);

            totalAmount = totalAmount.add(totalPrice);
        }

        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Order not found to delete with id: " + id);
        }

        orderRepository.deleteById(id);
    }

}
