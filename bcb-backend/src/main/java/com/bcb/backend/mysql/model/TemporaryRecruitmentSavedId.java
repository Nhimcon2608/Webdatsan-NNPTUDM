package com.bcb.backend.mysql.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TemporaryRecruitmentSavedId implements Serializable {
    
    @Column(name = "temporary_recruitment_id")
    private String temporaryRecruitmentId;

    @Column(name = "player_id")
    private String playerId;
}
