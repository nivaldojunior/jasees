package br.com.jasees.web.rest;

import com.codahale.metrics.annotation.Timed;
import br.com.jasees.domain.Election;

import br.com.jasees.repository.ElectionRepository;
import br.com.jasees.web.rest.util.HeaderUtil;
import br.com.jasees.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Election.
 */
@RestController
@RequestMapping("/api")
public class ElectionResource {

    private final Logger log = LoggerFactory.getLogger(ElectionResource.class);

    private static final String ENTITY_NAME = "election";
        
    private final ElectionRepository electionRepository;

    public ElectionResource(ElectionRepository electionRepository) {
        this.electionRepository = electionRepository;
    }

    /**
     * POST  /elections : Create a new election.
     *
     * @param election the election to create
     * @return the ResponseEntity with status 201 (Created) and with body the new election, or with status 400 (Bad Request) if the election has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/elections")
    @Timed
    public ResponseEntity<Election> createElection(@Valid @RequestBody Election election) throws URISyntaxException {
        log.debug("REST request to save Election : {}", election);
        if (election.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new election cannot already have an ID")).body(null);
        }
        Election result = electionRepository.save(election);
        return ResponseEntity.created(new URI("/api/elections/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /elections : Updates an existing election.
     *
     * @param election the election to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated election,
     * or with status 400 (Bad Request) if the election is not valid,
     * or with status 500 (Internal Server Error) if the election couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/elections")
    @Timed
    public ResponseEntity<Election> updateElection(@Valid @RequestBody Election election) throws URISyntaxException {
        log.debug("REST request to update Election : {}", election);
        if (election.getId() == null) {
            return createElection(election);
        }
        Election result = electionRepository.save(election);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, election.getId().toString()))
            .body(result);
    }

    /**
     * GET  /elections : get all the elections.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of elections in body
     */
    @GetMapping("/elections")
    @Timed
    public ResponseEntity<List<Election>> getAllElections(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Elections");
        Page<Election> page = electionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/elections");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /elections/:id : get the "id" election.
     *
     * @param id the id of the election to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the election, or with status 404 (Not Found)
     */
    @GetMapping("/elections/{id}")
    @Timed
    public ResponseEntity<Election> getElection(@PathVariable String id) {
        log.debug("REST request to get Election : {}", id);
        Election election = electionRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(election));
    }

    /**
     * DELETE  /elections/:id : delete the "id" election.
     *
     * @param id the id of the election to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/elections/{id}")
    @Timed
    public ResponseEntity<Void> deleteElection(@PathVariable String id) {
        log.debug("REST request to delete Election : {}", id);
        electionRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

}
