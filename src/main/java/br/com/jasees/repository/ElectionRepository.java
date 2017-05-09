package br.com.jasees.repository;

import br.com.jasees.domain.Election;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Election entity.
 */
@SuppressWarnings("unused")
public interface ElectionRepository extends MongoRepository<Election,String> {

}
