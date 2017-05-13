package br.com.jasees.web.rest.vm;

import br.com.jasees.service.dto.UserDTO;
import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * View Model object for a Election Result.
 */
public class ElectionResultVM {
    private UserDTO candidate;
    private Integer votes;

    @JsonCreator
    public ElectionResultVM() {
        // Empty public constructor used by Jackson.
    }

    public UserDTO getCandidate() {
        return candidate;
    }

    public void setCandidate(UserDTO candidate) {
        this.candidate = candidate;
    }

    public Integer getVotes() {
        return votes;
    }

    public void setVotes(Integer votes) {
        this.votes = votes;
    }

    @Override
    public String toString() {
        return "ElectionResultVM{" +
            "candidate=" + candidate +
            ", votes=" + votes +
            '}';
    }
}
