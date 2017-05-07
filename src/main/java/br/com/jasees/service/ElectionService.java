package br.com.jasees.service;

import br.com.jasees.domain.Election;
import br.com.jasees.domain.User;
import br.com.jasees.repository.ElectionRepository;
import br.com.jasees.repository.UserRepository;
import br.com.jasees.security.SecurityUtils;
import br.com.jasees.web.rest.vm.VoteVM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.ZonedDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service Implementation for managing Election.
 */
@Service
public class ElectionService {

    private final Logger log = LoggerFactory.getLogger(ElectionService.class);

    private ElectionRepository electionRepository;

    private UserRepository userRepository;

    public ElectionService(ElectionRepository electionRepository, UserRepository userRepository) {
        this.electionRepository = electionRepository;
        this.userRepository = userRepository;
    }

    public Election createElection(Election election) {
        election.init();
        electionRepository.save(election);
        return election;
    }

    public BigInteger vote(Election election, String user, VoteVM voteVM) {
        BigInteger result = election.vote(user, voteVM.getCandidate(), voteVM.getBias());
        electionRepository.save(election);
        return result;
    }

    public Optional<User> verifyVote(Election election, String pNumber) {
        return Optional.ofNullable(userRepository.findOne(election.verifyVote(new BigInteger(pNumber))));
    }

    public Map<String, Integer> getElectionResult(Election election) {
        Map<String, Integer> result = new LinkedHashMap<>();
        election.countVotes()
            .entrySet()
            .stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .forEachOrdered(x -> result.put(x.getKey(), x.getValue()));
        return result;
    }

    public Page<Election> getElections(Pageable pageable, String filter) {
        if (filter.equals("finished")) {
            return electionRepository.findAllByEndDateBefore(pageable, ZonedDateTime.now());
        } else if (filter.equals("inprogress")) {
            return electionRepository.findAllByInitDateBeforeAndEndDateAfter(pageable, ZonedDateTime.now(), ZonedDateTime.now());
        } else if (filter.equals("notstarted")) {
            return electionRepository.findAllByInitDateAfter(pageable, ZonedDateTime.now());
        } else {
            return electionRepository.findAll(pageable);
        }
    }

    public Integer ifVoted(Election election) {
        Optional<User> user = userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin());
        return !user.isPresent() ? 0 : election.ifVoted(user.get().getId());
    }

}
