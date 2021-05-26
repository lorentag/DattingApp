import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  public member:Member;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild("memberTabs", {static: true}) memberTabs: TabsetComponent;
  activeTab: TabDirective; 
  messages: Message[] = [];

  constructor(private memberService:MembersService, 
              private activatedRoute: ActivatedRoute, 
              private messageService: MessageService ) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe( data => { 
      this.member = data.member;
    });

    this.activatedRoute.queryParams.subscribe(params => {
       console.log(params.tab);
       params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    });

    
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

    this.galleryImages = this.getImages();
    
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

  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe( response => { 
        this.messages = response;
    });
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === "Messages" && this.messages) {
       this.loadMessages();
    }
  }

  selectTab(tabId: number) {
     this.memberTabs.tabs[tabId].active = true;
  }

}
