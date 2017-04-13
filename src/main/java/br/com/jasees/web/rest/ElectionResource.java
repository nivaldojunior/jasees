package br.com.jasees.web.rest;

import br.com.jasees.domain.Election;
import br.com.jasees.domain.User;
import br.com.jasees.repository.ElectionRepository;
import br.com.jasees.repository.UserRepository;
import br.com.jasees.security.AuthoritiesConstants;
import br.com.jasees.security.SecurityUtils;
import br.com.jasees.service.ElectionService;
import br.com.jasees.web.rest.util.HeaderUtil;
import br.com.jasees.web.rest.util.PaginationUtil;
import br.com.jasees.web.rest.vm.VoteVM;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
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

    private final UserRepository userRepository;

    private final ElectionService electionService;

    public ElectionResource(ElectionRepository electionRepository, UserRepository userRepository, ElectionService electionService) {
        this.electionRepository = electionRepository;
        this.userRepository = userRepository;
        this.electionService = electionService;
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
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Election> createElection(@Valid @RequestBody Election election) throws URISyntaxException {
        log.debug("REST request to save Election : {}", election);
        if (election.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new election cannot already have an ID")).body(null);
        }
        Election result = electionService.createElection(election);
        return ResponseEntity.created(new URI("/api/elections/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId()))
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
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Election> updateElection(@Valid @RequestBody Election election) throws URISyntaxException {
        log.debug("REST request to update Election : {}", election);
        if (election.getId() == null) {
            return createElection(election);
        }
        Election result = electionRepository.save(election);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, election.getId()))
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
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Void> deleteElection(@PathVariable String id) {
        log.debug("REST request to delete Election : {}", id);
        electionRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    @PutMapping("/elections/{id}/vote")
    @Timed
    public ResponseEntity vote(@PathVariable String id, @RequestBody VoteVM voteVM) {
        log.debug("REST request to vote in Election : {}", id);

        Optional<User> user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin());
        Optional<Election> election = Optional.ofNullable(electionRepository.findOne(id));

        if (!user.isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "usernotlogged", "You should logged to vote."))
                .body(null);
        } else if (!election.isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "electioninvalid", "Election invalid"))
                .body(null);
        } else if (!Optional.ofNullable(userRepository.findOne(voteVM.getCandidate())).isPresent()
            || !election.get().getCandList().contains(voteVM.getCandidate())) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "candidateinvalid", "Candidate invalid"))
                .body(null);
        } else if (election.get().ifVoted(user.get().getId()) && voteVM.getBias()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "alreadyvoted", "User already voted"))
                .body(null);
        } else if (election.get().getInitDate().isAfter(ZonedDateTime.now())) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "electionnotstarted", "Election not started"))
                .body(null);
        } else if (election.get().getEndDate().isBefore(ZonedDateTime.now())) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "electionfinished", "Election is finished"))
                .body(null);
        } else {
            return ResponseEntity.ok().body(electionService.vote(election.get(), user.get().getId(), voteVM));
        }
    }

    @GetMapping("/elections/{id}/verifyVote")
    @Timed
    public ResponseEntity<User> verifyVote(@PathVariable String id, @RequestBody String pNumber) {
        log.debug("REST request to verify vote in Election : {}", id);

        Optional<User> user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin());
        Optional<Election> election = Optional.ofNullable(electionRepository.findOne(id));

        if (!user.isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "usernotlogged", "You should logged to verify vote."))
                .body(null);
        } else if (!election.isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "electioninvalid", "Election invalid"))
                .body(null);
        } else if (election.get().getEndDate().isAfter(ZonedDateTime.now())) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "electionnotfinished", "Election is not finished"))
                .body(null);
        } else {
            return ResponseUtil.wrapOrNotFound(electionService.verifyVote(election.get(), pNumber));
        }
    }

    @GetMapping("/elections/{id}/results")
    @Timed
    public ResponseEntity<Map<String, Integer>> getResults(@PathVariable String id) {
        log.debug("REST request to get result of Election : {}", id);

        Optional<Election> election = Optional.ofNullable(electionRepository.findOne(id));

        if (!election.isPresent()) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "electioninvalid", "Election invalid"))
                .body(null);
        } else if (election.get().getEndDate().isAfter(ZonedDateTime.now())) {
            return ResponseEntity.badRequest()
                .headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "electionnotfinished", "Election is not finished"))
                .body(null);
        } else {
            return ResponseEntity.ok().body(electionService.getElectionResult(election.get()));
        }
    }
}
