
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TermsSection = ({ terms, setTerms, onTermChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium text-gray-800 mb-3">Section 2: Terms and Conditions</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Terms</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Response</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Comments</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((term, index) => (
              <tr key={term.id} className="border-b border-gray-200">
                <td className="px-4 py-2 text-sm">
                  <Input 
                    value={term.description}
                    onChange={(e) => {
                      const newTerms = [...terms];
                      newTerms[index].description = e.target.value;
                      setTerms(newTerms);
                    }}
                    className="input-field"
                  />
                </td>
                <td className="px-4 py-2">
                  <Select 
                    value={term.agree} 
                    onValueChange={(value) => onTermChange(term.id, 'agree', value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agree">Agree</SelectItem>
                      <SelectItem value="disagree">Disagree</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-2">
                  <Input 
                    placeholder="Optional comments" 
                    value={term.comments}
                    onChange={(e) => onTermChange(term.id, 'comments', e.target.value)}
                    className="input-field"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TermsSection;
