import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(label?: string): string {
    switch (label?.toLowerCase()) {
      case 'ouvert': return 'text-green-600'; 
      case 'complet': return 'text-orange-500';    
      case 'annulé': return 'text-red-600';        
      case 'terminé': return 'text-gray-500'; 
      default: return 'text-black';               
    }
  }
}
