package br.com.jasees.repository;

import br.com.jasees.domain.Election;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data MongoDB repository for the Election entity.
 */
public interface ElectionRepository extends MongoRepository<Election, String> {

    Page<Election> findAllByInitDateAfter(Pageable pageable, ZonedDateTime dateTime);

    Page<Election> findAllByInitDateBeforeAndEndDateAfter(Pageable pageable, ZonedDateTime dateTime, ZonedDateTime dateTime2);

    Page<Election> findAllByEndDateBefore(Pageable pageable, ZonedDateTime dateTime);

}
