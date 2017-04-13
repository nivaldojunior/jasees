package br.com.jasees.web.rest.vm;

import com.fasterxml.jackson.annotation.JsonCreator;

/**
 * View Model object for storing a Vote.
 */
public class VoteVM {

    private String candidate;

    private Boolean bias;

    @JsonCreator
    public VoteVM() {
        // Empty public constructor used by Jackson.
    }

    public String getCandidate() {
        return candidate;
    }

    public void setCandidate(String candidate) {
        this.candidate = candidate;
    }

    public Boolean getBias() {
        return bias;
    }

    public void setBias(Boolean bias) {
        this.bias = bias;
    }

    @Override
    public String toString() {
        return "LoggerVM{" +
            "candidate='" + candidate + '\'' +
            ", bias='" + bias + '\'' +
            '}';
    }
}
