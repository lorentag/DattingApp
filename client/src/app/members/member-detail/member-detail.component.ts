import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  public member:Member;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private memberService:MembersService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      },
    ];
    
  }

  getImages(): NgxGalleryImage[] {
    const imagesUrl = [];

    for (const photo of this.member.photos) {
       imagesUrl.push({
         small: photo?.url,
         medium: photo?.url,
         big: photo?.url, 
       });
    }

    return imagesUrl;

  }

  loadMember() {
    this.memberService.getMember(this.activatedRoute.snapshot.paramMap.get('username')).subscribe( member => { 
      this.member = member;
      console.log(member);
      this.galleryImages = this.getImages();
    }) 
  }

}
