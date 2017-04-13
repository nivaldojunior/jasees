package br.com.jasees.repository;

import br.com.jasees.domain.Election;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data MongoDB repository for the Election entity.
 */
public interface ElectionRepository extends MongoRepository<Election,String> {

    List<Election> findAllByInitDateAfter(ZonedDateTime dateTime);

    List<Election> findAllByInitDateBeforeAndEndDateAfter(ZonedDateTime dateTime, ZonedDateTime dateTime2);

    List<Election> findAllByEndDateBefore(ZonedDateTime dateTime);

}
