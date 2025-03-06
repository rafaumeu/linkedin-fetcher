import type { ProfileData } from "../../@types/linkedin.d";
import { createMockProfile } from "../factories/profileData";

/**
 * Builder para criar perfis de teste com configurações personalizadas
 */
export class ProfileBuilder {
	private profile: ProfileData;

	constructor() {
		this.profile = createMockProfile();
	}

	/**
	 * Define o nome do perfil
	 */
	withName(name: string): ProfileBuilder {
		this.profile.name = name;
		return this;
	}

	/**
	 * Define o headline do perfil
	 */
	withHeadline(headline: string): ProfileBuilder {
		this.profile.headline = headline;
		return this;
	}

	/**
	 * Define a localização do perfil
	 */
	withLocation(location: string): ProfileBuilder {
		this.profile.location = location;
		return this;
	}

	/**
	 * Define a descrição "sobre" do perfil
	 */
	withAbout(about: string): ProfileBuilder {
		this.profile.about = about;
		return this;
	}

	/**
	 * Adiciona uma experiência ao perfil
	 */
	withExperience(experience: ProfileData["experience"][0]): ProfileBuilder {
		this.profile.experience.push(experience);
		return this;
	}

	/**
	 * Define todas as experiências do perfil
	 */
	withExperiences(experiences: ProfileData["experience"]): ProfileBuilder {
		this.profile.experience = experiences;
		return this;
	}

	/**
	 * Adiciona uma educação ao perfil
	 */
	withEducation(education: ProfileData["education"][0]): ProfileBuilder {
		this.profile.education.push(education);
		return this;
	}

	/**
	 * Define todas as educações do perfil
	 */
	withEducations(educations: ProfileData["education"]): ProfileBuilder {
		this.profile.education = educations;
		return this;
	}

	/**
	 * Adiciona uma certificação ao perfil
	 */
	withCertification(
		certification: ProfileData["certifications"][0],
	): ProfileBuilder {
		this.profile.certifications.push(certification);
		return this;
	}

	/**
	 * Define todas as certificações do perfil
	 */
	withCertifications(
		certifications: ProfileData["certifications"],
	): ProfileBuilder {
		this.profile.certifications = certifications;
		return this;
	}

	/**
	 * Constrói o perfil com as configurações definidas
	 */
	build(): ProfileData {
		return { ...this.profile };
	}

	/**
	 * Cria um perfil vazio
	 */
	buildEmpty(): ProfileData {
		return {
			name: "",
			headline: "",
			location: "",
			about: "",
			experience: [],
			education: [],
			certifications: [],
		};
	}
}
