package br.com.jasees.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A Election.
 */

@Document(collection = "election")
public class Election implements Serializable {

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
    private ZonedDateTime initDate;

    @NotNull
    @Field("end_date")
    private ZonedDateTime endDate;

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

    public ZonedDateTime getInitDate() {
        return initDate;
    }

    public Election initDate(ZonedDateTime initDate) {
        this.initDate = initDate;
        return this;
    }

    public void setInitDate(ZonedDateTime initDate) {
        this.initDate = initDate;
    }

    public ZonedDateTime getEndDate() {
        return endDate;
    }

    public Election endDate(ZonedDateTime endDate) {
        this.endDate = endDate;
        return this;
    }

    public void setEndDate(ZonedDateTime endDate) {
        this.endDate = endDate;
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
        if (election.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, election.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Election{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", desc='" + desc + "'" +
            ", initDate='" + initDate + "'" +
            ", endDate='" + endDate + "'" +
            '}';
    }
}
