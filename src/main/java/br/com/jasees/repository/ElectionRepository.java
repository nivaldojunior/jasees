package br.com.jasees.repository;

import br.com.jasees.domain.Election;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;

/**
 * Spring Data MongoDB repository for the Election entity.
 */
public interface ElectionRepository extends MongoRepository<Election,String> {

    Page<Election> findAllByInitDateAfter(Pageable pageable, Instant dateTime);

    Page<Election> findAllByInitDateBeforeAndEndDateAfter(Pageable pageable, Instant dateTime, Instant dateTime2);

    Page<Election> findAllByEndDateBefore(Pageable pageable, Instant dateTime);

}
