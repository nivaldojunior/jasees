package br.com.jasees.domain;

import br.com.jasees.config.Constants;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigInteger;
import java.time.Instant;
import java.util.*;

/**
 * A Election.
 */

@Document(collection = "election")
public class Election extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Size(min = 3, max = 50)
    @Field("name")
    private String name;

    @NotNull
    @Size(min = 20, max = 500)
    @Field("desc")
    private String desc;

    @NotNull
    @Field("init_date")
    private Instant initDate;

    @NotNull
    @Field("end_date")
    private Instant endDate;

    @NotNull
    @Size(min = 2)
    @Field("cand_list")
    @DBRef
    private Set<User> candList;

    @JsonIgnore
    @Field("voted_list")
    private Map<String, Integer> votedList;

    @JsonIgnore
    @Field("prime_list")
    private Set<BigInteger> primeList;

    @JsonIgnore
    @Field("vote_error")
    private Map<String, Integer> voteError;

    @JsonIgnore
    @Field("result_list")
    private Map<String, BigInteger> resultList;

    public void init() {
        votedList = new HashMap<>();
        primeList = new HashSet<>();
        voteError = new HashMap<>();
        resultList = new HashMap<>();
        candList.forEach(cand -> {
            resultList.put(cand.getId(), generatePrimeNumber());
            voteError.put(cand.getId(), 0);
        });
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Election name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesc() {
        return desc;
    }

    public Election desc(String desc) {
        this.desc = desc;
        return this;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Instant getInitDate() {
        return initDate;
    }

    public Election initDate(Instant initDate) {
        this.initDate = initDate;
        return this;
    }

    public void setInitDate(Instant initDate) {
        this.initDate = initDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public Election endDate(Instant endDate) {
        this.endDate = endDate;
        return this;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public Set<User> getCandList() {
        return candList;
    }

    public void setCandList(Set<User> candList) {
        this.candList = candList;
    }

    public Integer ifVoted(String user) {
        return votedList.getOrDefault(user, 0);
    }

    private BigInteger generatePrimeNumber() {
        Random random = new Random();
        Integer bitLength = Constants.PRIME_NUMBER_BIT_LENGTH;
        BigInteger primeNumber;
        do {
            primeNumber = BigInteger.probablePrime(bitLength, random);
        } while (primeList.contains(primeNumber));
        primeList.add(primeNumber);
        return primeNumber;
    }

    public BigInteger vote(String cand, String user, Boolean bias) {
        BigInteger result = generatePrimeNumber();
        BigInteger get = resultList.get(cand);
        Integer beforeLength = get.bitLength();
        Integer bitLength = Constants.PRIME_NUMBER_BIT_LENGTH;
        resultList.put(cand, get.multiply(result));
        Integer error = voteError.get(cand);
        if (resultList.get(cand).bitLength() != beforeLength + bitLength) {
            voteError.put(cand, ++error);
        }
        if (!bias) {
            voteError.put(cand, (error - bitLength));
            votedList.put(user, 2);
        }else{
            votedList.put(user, 1);
        }
        return result;
    }

    public String verifyVote(BigInteger primeNumber) {
        ArrayList<String> results = new ArrayList<>();
        resultList.forEach((k, v) -> {
            if (v.divideAndRemainder(primeNumber)[1].equals(BigInteger.ZERO)) {
                results.add(k);
            }
        });
        if (results.size() == 1) {
            return results.get(0);
        } else {
            return null;
        }
    }

    public Map<String, Integer> countVotes() {
        Map<String, Integer> result = new HashMap<>();
        resultList.forEach((k, v) -> {
            Double bitLength = Constants.PRIME_NUMBER_BIT_LENGTH.doubleValue();
            Double error = voteError.get(k) / bitLength;
            Double partial = (v.bitLength() - bitLength) / bitLength;
            Integer votes = (int) (partial + error);
            result.put(k, votes);
        });
        return result;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Election election = (Election) o;
        if (election.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), election.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Election{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", desc='" + getDesc() + "'" +
            ", initDate='" + getInitDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", candList='" + getCandList() + "'" +
            "}";
    }
}
