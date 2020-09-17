from django.shortcuts import render
from django.views.generic import TemplateView

class Test(TemplateView):
    template_name='index.html'
    def get(self, request, *args, **kwargs):
        print('\n\n',request,'\n\n')
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)
