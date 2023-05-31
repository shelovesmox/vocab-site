import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { BaseClass } from "./BaseClass";

// change entire Entity to "word" - words should have definitions, not definitions should have definitons lol


@Entity('Word')
export class Word extends BaseClass {
  @PrimaryColumn()
  uuid: string;

  @Column({ default: null, nullable: true})
  term: string;

  @Column({ nullable: true })
  audio: string

  @Column({nullable: true})
  phonetic: string;

  @Column({nullable: false})
  meaning: string;

  @Column({type: "simple-array"})
  definitons: string[];

  @Column({type: "simple-array"})
  examples: string[];

  @Column()
  isGenerated: boolean;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  dislikes: number;

  @ManyToOne(() => User, user => user.definitions)
  user: User;
  
  @Column({type: "simple-array"})
  likedBy: string[];

  @Column({type: "simple-array"})
  dislikedBy: string[];
  
  @Column({ type: 'simple-array'})
  synonyms: string[];

  @Column({ type: 'simple-array' })
  antonyms: string[];
}
